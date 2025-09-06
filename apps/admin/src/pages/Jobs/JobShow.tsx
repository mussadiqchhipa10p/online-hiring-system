import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField, DateField, ChipField } from 'react-admin';

export const JobShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="location" />
      <ChipField source="status" />
      <NumberField source="views" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
