import { BadRequestException } from '@nestjs/common';

export class CommonUtils {
  static arrayGroupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K): Record<K, T[]> {
    return arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }

  static uniqueArrayGroupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K): Record<K, T> {
    return arr.reduce((groups, item) => {
      if (groups[key(item)]) {
        throw new BadRequestException(`Duplicate item with key ${String(key(item))}`);
      }
      groups[key(item)] = item;
      return groups;
    }, {} as Record<K, T>);
  }
}
