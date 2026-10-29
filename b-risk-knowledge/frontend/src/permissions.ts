/** v1 checks exact actions; role fallbacks apply only to legacy sessions. */
export function permits(project: {permissions?: string[] | null; roles: string[]; can_run?: boolean} | undefined, action: string): boolean {
  if (!project) return false;
  if (project.permissions != null) return project.permissions.includes(action);
  if (['knowledge.process','retrospective.generate','retrospective.edit','imports.create','imports.retry'].includes(action)) return !!project.can_run;
  if (['knowledge.review','knowledge.publish','retrospective.review','imports.withdraw'].includes(action)) return project.roles.some(r=>['admin','reviewer'].includes(r));
  if (action==='training.manage') return project.roles.some(r=>['admin','teacher'].includes(r));
  if (action==='training.review') return project.roles.some(r=>['admin','teacher','reviewer'].includes(r));
  return true;
}
