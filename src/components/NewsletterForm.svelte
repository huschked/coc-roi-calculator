<script lang="ts">
    import { onMount } from 'svelte';
  
    // ── REPLACE this with exactly the <script> URL Brevo gave you ──
    const embedScriptUrl = 'https://sibforms.com/forms/XXXXXXXXX.js';
  
    onMount(() => {
      // Create the Brevo embed script
      const script = document.createElement('script');
      script.src = embedScriptUrl;
      script.async = true;
  
      // Optional: if they gave you an id, set it here
      // script.id = 'sib_embed_signup';
  
      // Append it into our container
      const container = document.getElementById('brevo-form-container');
      if (container) container.appendChild(script);
    });
  </script>
  
  <!-- Container for Brevo to inject the form -->
  <div id="brevo-form-container" class="mt-8"></div>
  
  <style>
    /* Add any spacing or max-width you like */
    #brevo-form-container {
      max-width: 400px;
      margin: 0 auto;
    }
  </style>
  