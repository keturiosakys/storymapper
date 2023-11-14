import { parse } from "npm:chrono-node";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import pyodideMod from "npm:pyodide/pyodide.js";

const { loadPyodide } = pyodideMod;

const pyodide = await loadPyodide();
await pyodide.loadPackage("micropip");
const micropip = await pyodide.pyimport("micropip");
micropip.install("spacy");

const mountDir = "/mnt";
pyodide.FS.mkdir(mountDir);
pyodide.FS.mount(pyodide.FS.filesystems.WORKERFS, { root: "." }, mountDir);
micropip.install("./mnt/en_core_web_sm-3.7.0-py3-none-any.whl");

const port = 3000;

type RequestText = {
  text: string;
};

type ReturnDate = {
  date: string;
  sourceLocation: number;
  source: string;
};

const PARSE_ROUTE = new URLPattern({ pathname: "/parse_source" });

async function main(req: Request) {
  const match = PARSE_ROUTE.exec(req.url);

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const body = (await req.json()).text;

  const results = {
    dates: parseDates(body),
    locations: parseLocations(body),
  };

  return new Response(JSON.stringify(results), { status: 200 });
}

function parseDates(body: string) {
  const dates = parse(body);
  let parsedDates: ReturnDate[] = [];

  if (dates.length !== 0) {
    parsedDates = dates.map((res) => {
      return {
        date: res.date().toISOString(),
        sourceLocation: res.index,
        source: res.text,
      };
    });
  }

  return parsedDates;
}

type ReturnLocation = {
  name: string;
  sourceLocation: [number, number];
  sourceText: string;
  lat: number;
  lng: number;
};

function parseLocations(body: string) {
  const res = pyodide.runPython(`
import spacy
import json

NLP = spacy.load("en_core_web_sm")

raw_text = "${body}"

parsed = NLP(raw_text, disable=["parser"])
processed = []

for word in parsed.ents:
	if word.label_ == "GPE":
		parsed_location = { "text": word.text, "pos_start": word.start_char, "pos_end": word.end_char}
		processed.append(parsed_location)

json.dumps(processed)
	`);
  console.log(res);
  const locations = JSON.parse(res);
  return locations;
}

Deno.serve({ port }, main);
