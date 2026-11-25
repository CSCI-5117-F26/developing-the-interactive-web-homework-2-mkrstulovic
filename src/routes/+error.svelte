<script lang="ts">
  import * as Card from "#lib/components/ui/card/index.ts";
 </script>

 <div class="flex justify-center mt-40">
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-destructive">Page Not Found</Card.Title>
      <Card.Description>
        Unfortunately, this page does not exist... Let's get you back to your To-Do List!
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <a class="text-chart-1" href='/todos'>Go back to to-do list</a>
    </Card.Content>
  </Card.Root>
</div>