<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import { createLowlight, common } from "lowlight";
	import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

	let editor_root: Element;
	let editor: Editor;

	const lowlight = createLowlight(common);

	onMount(() => {
		editor = new Editor({
			element: editor_root,
			extensions: [
				CodeBlockLowlight.configure({
					lowlight
				}),
				StarterKit.configure({
					codeBlock: false,
					heading: {
						levels: [1, 2, 3]
					}
				})
			],
			content:
				"<p>The video featuring alleged Ukrainian figures in Sudan began circulating online on October 6, 2023. It was subsequently shared by Telegram channels such as Trukha Ukraine and the news website Babel.ua. The latter claimed that sources in the country’s intelligence community had confirmed that the men in the video are Ukrainians fighting against the RSF.</p>",
			onTransaction: ({ editor }) => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			editorProps: {
				attributes: {
					class: "prose max-w-none h-full"
				}
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={editor_root} class="h-full w-full p-4" />

<style>
</style>
