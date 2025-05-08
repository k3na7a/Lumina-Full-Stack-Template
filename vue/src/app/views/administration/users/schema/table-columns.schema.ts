type columns = Array<{ name: string; label: string }>

const tableColumns: columns = [
  { name: 'user', label: 'forms.user' },
  { name: 'role', label: 'forms.role' },
  { name: 'created', label: 'forms.date-registered' },
  { name: 'actions', label: 'forms.actions' }
]

export { tableColumns }
