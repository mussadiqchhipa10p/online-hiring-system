import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField, ChipField } from 'react-admin';

export const ApplicationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="job.title" label="Job Title" />
      <TextField source="candidate.user.name" label="Candidate" />
      <ChipField source="status" />
      <TextField source="notes" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
