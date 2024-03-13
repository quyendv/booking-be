import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

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

  static getEmailName(email: string): string {
    return email.split('@')[0];
  }

  static getNextEnumValues<T>(
    enumObject: Record<string, T>,
    currentValue: T,
    includeCurrentValue = false,
  ): T[] {
    const allValues = Object.values(enumObject);
    if (!currentValue) return allValues;

    const currentIndex = allValues.indexOf(currentValue);
    if (currentIndex === -1 || currentIndex === allValues.length - 1) {
      throw new InternalServerErrorException(
        `Value ${currentValue} not found in enum ${enumObject}`,
      );
    }

    return allValues.slice(currentIndex + (includeCurrentValue ? 0 : 1));
  }
}
