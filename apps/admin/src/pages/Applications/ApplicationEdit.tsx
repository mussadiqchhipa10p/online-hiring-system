import React from 'react';
import { Edit, SimpleForm, SelectInput, TextInput, required } from 'react-admin';

const statusChoices = [
  { id: 'PENDING', name: 'Pending' },
  { id: 'REVIEW', name: 'Review' },
  { id: 'INTERVIEW_SCHEDULED', name: 'Interview Scheduled' },
  { id: 'REJECTED', name: 'Rejected' },
  { id: 'HIRED', name: 'Hired' },
];

export const ApplicationEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput source="status" choices={statusChoices} validate={[required()]} />
      <TextInput source="notes" multiline rows={4} />
    </SimpleForm>
  </Edit>
);
