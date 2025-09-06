import React from 'react';
import { Create, SimpleForm, TextInput, SelectInput, required } from 'react-admin';

const roleChoices = [
  { id: 'ADMIN', name: 'Admin' },
  { id: 'EMPLOYER', name: 'Employer' },
  { id: 'CANDIDATE', name: 'Candidate' },
];

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required()]} />
      <TextInput source="password" type="password" validate={[required()]} />
      <SelectInput source="role" choices={roleChoices} validate={[required()]} />
    </SimpleForm>
  </Create>
);
