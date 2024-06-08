type permission = {
  path: string;
  permission: string;
};

export const PermissionList: permission[] = [
  { path: '/projects/:id', permission: 'project:view' },
];
