import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput, required } from 'react-admin';

const roleChoices = [
  { id: 'ADMIN', name: 'Admin' },
  { id: 'EMPLOYER', name: 'Employer' },
  { id: 'CANDIDATE', name: 'Candidate' },
];

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required()]} />
      <SelectInput source="role" choices={roleChoices} validate={[required()]} />
    </SimpleForm>
  </Edit>
);
