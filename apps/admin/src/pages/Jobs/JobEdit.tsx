import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput, required } from 'react-admin';

const statusChoices = [
  { id: 'DRAFT', name: 'Draft' },
  { id: 'PUBLISHED', name: 'Published' },
  { id: 'CLOSED', name: 'Closed' },
];

export const JobEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={4} validate={[required()]} />
      <TextInput source="location" validate={[required()]} />
      <SelectInput source="status" choices={statusChoices} validate={[required()]} />
    </SimpleForm>
  </Edit>
);
