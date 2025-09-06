import React from 'react';
import { List, Datagrid, TextField, NumberField, DateField, EditButton, ShowButton, DeleteButton, ChipField } from 'react-admin';

export const JobList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="employer.companyName" label="Company" />
      <TextField source="location" />
      <ChipField source="status" />
      <NumberField source="views" />
      <DateField source="createdAt" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
