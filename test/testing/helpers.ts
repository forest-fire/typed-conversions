import './test-console'; // TS declaration
import { IDictionary } from 'common-types';
import { first, last } from 'lodash';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
export { first, last } from 'lodash';
export function setupEnv() {

  if (! process.env.AWS_STAGE) {
    process.env.AWS_STAGE = 'test';
  }
  const current = process.env;
  const yamlConfig = yaml.safeLoad(fs.readFileSync('./env.yml', 'utf8'));
  const combined = {
    ...yamlConfig[process.env.AWS_STAGE],
    ...process.env
  };

  console.log(`Loading ENV for "${process.env.AWS_STAGE}"`);
  Object.keys(combined).forEach(key => process.env[key] = combined[key]);
  return combined;
}

export function firstKey<T = any>(listOf: IDictionary<T>) {
  return first(Object.keys(listOf));
}

export function lastKey<T = any>(listOf: IDictionary<T>) {
  return last(Object.keys(listOf));
}

export function valuesOf<T = any>(listOf: IDictionary<T>, property: string) {
  const keys: any[] = Object.keys(listOf);
  return keys.map((key: any) => {
    const item: IDictionary = listOf[key];
    return item[property];
  });
}

export function length(listOf: IDictionary) {
  return listOf ? Object.keys(listOf).length : 0;
}
