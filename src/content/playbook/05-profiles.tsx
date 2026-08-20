import { Section, Table } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';

export function SectionProfiles() {
  return (
    <Section
      id="profiles" n="05" title="Profile system"
      lead="Every profile carries the same avatar, the same one-line description and the same link. Consistency across profiles is worth more than a clever bio on any one of them."
    >
      <h3>The standard set</h3>
      <Table
        head={['Surface', 'Avatar', 'Cover', 'Bio limit']}
        rows={[
          ['X', 'Green (default)', 'X header 1500×500', '160 characters'],
          ['LinkedIn', 'Green (default)', 'LinkedIn cover 1584×396', '220 characters'],
          ['Instagram', 'Green (default)', '—', '150 characters'],
          ['YouTube', 'Green (default)', 'Channel art 2560×1440', '1000 characters'],
          ['GitHub', 'Ink (stealth)', 'Social preview 1280×640', '160 characters'],
          ['Podcast', 'Symbol / mark', 'Podcast cover 3000×3000', '—'],
        ]}
      />

      <h3>Avatar rules</h3>
      <ul>
        <li>Every platform circle-crops. The mark sits inside the inscribed circle, with the 28px safe inset the studio draws as a guide.</li>
        <li><strong>Green</strong> is the default everywhere. Change it only for a reason — Ink on developer surfaces, Mono where the platform flattens colour.</li>
        <li>The <strong>Float</strong> avatar is for campaign seasons only, and it goes back to Green afterwards.</li>
        <li>Never crop the wordmark into an avatar. At 400px the word is illegible; use the mark.</li>
      </ul>

      <h3>Cover rules</h3>
      <p>
        Two platforms overlay the profile photo on the cover: LinkedIn takes the lower left (about
        260px) and X overlaps the avatar plus crops responsively. The studio&rsquo;s cover presets
        already inset the lockup to clear both — do not re-centre them by eye.
      </p>

      <ArtboardFrame presetId="pr-x" label="Profile reference, with the bio counter" maxHeight={420} />
    </Section>
  );
}
