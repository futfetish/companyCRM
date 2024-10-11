import { Company, Employee, EmploymentType, Position } from "@prisma/client";
import { createEvent, createStore, sample } from "effector";

export const reset = createEvent();

export const addPositionId = createEvent<number>();
export const removePositionId = createEvent<number>();

interface EmployeeFull extends Employee {
  position: Position;
  company: Company;
}

export const $employees = createStore<EmployeeFull[]>([]);
export const setEmployees = createEvent<EmployeeFull[]>();

$employees.on(setEmployees, (_, employees) => employees);

export const $employeesType = createStore<EmploymentType>("staff");
export const setEmployeesType = createEvent<EmploymentType>();

$employeesType.on(setEmployeesType, (_, type) => type);

export const $positionIds = createStore<Set<number>>(new Set())
  .on(addPositionId, (state, id) => {
    const newState = new Set(state);
    newState.add(id);
    return newState;
  })
  .on(removePositionId, (state, id) => {
    const newState = new Set(state);
    newState.delete(id);
    return newState;
  });

export const $filteredEmployees = createStore<EmployeeFull[]>([]);

sample({
  source: {
    employees: $employees,
    positionFilter: $positionIds,
    typeFilter: $employeesType,
  },
  clock: [addPositionId, removePositionId, setEmployeesType, setEmployees],
  fn: ({ employees, positionFilter, typeFilter }) => {
    return employees.filter(
      (employee) =>
        (positionFilter.size === 0 ||
          positionFilter.has(employee.positionId)) &&
        employee.type === typeFilter,
    );
  },
  target: $filteredEmployees,
});
