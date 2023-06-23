import Container from "@/components/layout/Container";

export default function ZoomInstructionsPage() {
  return (
    <Container className="space-y-4">
      <h1>Zoom instructions</h1>
      <p>Instructions for installing the Sycamore app on the Zoom App Marketplace</p>
      <ul>
        <li>Sign up as a user on the Sycamore dashboard</li>
        <li>Create an organisation (or get invited to one)</li>
        <li>Go the the integrations tab on the settings page</li>
        <li>Sign in to give us access to your Zoom meeting and recording information</li>
        <li>All done! Your meeting recordings will now be synced to Sycamore, allowing you to analyse your sales calls.</li>
      </ul>
    </Container>
  )
}