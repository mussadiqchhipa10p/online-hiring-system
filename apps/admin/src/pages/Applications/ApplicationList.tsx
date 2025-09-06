import React from 'react';
import { List, Datagrid, TextField, DateField, EditButton, ShowButton, DeleteButton, ChipField } from 'react-admin';

export const ApplicationList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="job.title" label="Job Title" />
      <TextField source="candidate.user.name" label="Candidate" />
      <ChipField source="status" />
      <DateField source="createdAt" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
