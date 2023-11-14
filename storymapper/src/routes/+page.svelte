<script lang="ts">
  import Editor from "$lib/components/Editor.svelte";
  import Map from "$lib/components/Map.svelte";
</script>

<main>
  <section class="grid grid-cols-2 gap-4 h-screen">
    <div class="p-4 bg-white rounded shadow overflow-auto">
      <!-- Text Editor -->
      <Editor />
    </div>
    <div class="p-4 bg-white rounded shadow">
      <!-- Map -->
      <Map />
    </div>
  </section>
</main>
