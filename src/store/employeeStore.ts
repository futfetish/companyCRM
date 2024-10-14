import { Company, Employee, EmploymentType, Position } from "@prisma/client";
import { createEvent, createStore, sample } from "effector";

export const resetFilter = createEvent();

export const addPositionId = createEvent<number>();
export const removePositionId = createEvent<number>();

export const $employeesPositionIds = createStore<Set<number>>(new Set())
  .on(addPositionId, (state, id) => {
    const newState = new Set(state);
    newState.add(id);
    return newState;
  })
  .on(removePositionId, (state, id) => {
    const newState = new Set(state);
    newState.delete(id);
    return newState;
  })
  .reset(resetFilter)

export const addStatus = createEvent<string>();
export const removeStatus = createEvent<string>();

export const $employeesStatusList = createStore<Set<string>>(new Set())
  .on(addStatus, (state, id) => {
    const newState = new Set(state);
    newState.add(id);
    return newState;
  })
  .on(removeStatus, (state, id) => {
    const newState = new Set(state);
    newState.delete(id);
    return newState;
  })
  .reset(resetFilter)

export const addCompanyId = createEvent<number>();
export const removeCompanyId = createEvent<number>();

export const $employeesCompaniesIds = createStore<Set<number>>(new Set())
  .on(addCompanyId, (state, id) => {
    const newState = new Set(state);
    newState.add(id);
    return newState;
  })
  .on(removeCompanyId, (state, id) => {
    const newState = new Set(state);
    newState.delete(id);
    return newState;
  })
  .reset(resetFilter)

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



export const $filteredEmployees = createStore<EmployeeFull[]>([]);

sample({
  source: {
    employees: $employees,
    positionFilter: $employeesPositionIds,
    typeFilter: $employeesType,
    statusFilter: $employeesStatusList,
    companiesFilter: $employeesCompaniesIds
  },
  clock: [addPositionId, removePositionId, addStatus , removeStatus , setEmployeesType, setEmployees , addCompanyId , removeCompanyId],
  fn: ({ employees, positionFilter, typeFilter , statusFilter, companiesFilter }) => {
    return employees.filter((employee) => {
      const positionMatches = positionFilter.size === 0 || positionFilter.has(employee.positionId);
      const statusMatches = statusFilter.size === 0 || statusFilter.has(employee.status);
      const companiesMatches = companiesFilter.size === 0 || companiesFilter.has(employee.companyId);
      const typeMatches = employee.type === typeFilter;
    
      return positionMatches && statusMatches && typeMatches && companiesMatches;
    });
  },
  target: $filteredEmployees,
});

sample({
  clock: setEmployeesType,
  target: resetFilter,
});