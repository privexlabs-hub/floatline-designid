import { Section, Table, DoDont } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';

export function SectionPositioning() {
  return (
    <Section
      id="positioning" n="03" title="Positioning & category"
      lead="Floatline sells against the status quo — a person with thirty-two chats open — far more often than against a named competitor. The positioning has to beat “we already manage” before it beats any product."
    >
      <h3>The frame</h3>
      <Table
        head={['', 'The alternative', 'Floatline']}
        rows={[
          ['Where the work happens', 'A group chat and a spreadsheet', 'A run, on the channel people already use'],
          ['Who knows the status', 'Whoever last asked', 'Everyone, continuously'],
          ['What happens on failure', 'Found at reconciliation', 'Surfaced while it can still be fixed'],
          ['What it costs', '2–4 hours of the operator’s day', 'A monthly fee, priced per network'],
          ['What is left behind', 'Whatever people remember', 'An auditable record of every run'],
        ]}
      />

      <h3>The three objections, and the honest answers</h3>
      <ul>
        <li><strong>“My network will not adopt a new app.”</strong> They will not have to. That is the whole point of meeting them on WhatsApp, SMS or voice.</li>
        <li><strong>“I do not trust it to send on my behalf.”</strong> It drafts, you approve. Autonomy is something you grant later, per workflow, not a default.</li>
        <li><strong>“We are too small for this.”</strong> Nine people is enough for coordination to cost a morning. Below that, we say so.</li>
      </ul>

      <h3>Category language</h3>
      <DoDont
        doTitle="Say"
        dontTitle="Never say"
        dos={[
          'Workflow automation · coordination layer · runs and triggers',
          'Your network · the operator · members',
          'Broadcast · capacity matching · knowledge base · digest',
          'Named, sourced numbers',
        ]}
        donts={[
          '“AI-powered”, “intelligent”, “smart” as a product claim',
          '“WhatsApp bot”, “chatbot”, “conversational AI”',
          '“Users”, “end users”, “agents on platform”',
          'Any percentage we cannot attribute',
        ]}
      />

      <ArtboardFrame presetId="sq-comparison" label="Positioning against the status quo" />
    </Section>
  );
}
