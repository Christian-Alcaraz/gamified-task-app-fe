import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringService {
  isEqualIgnoreCase(str1: string, str2: string) {
    return str1?.toLowerCase() === str2?.toLowerCase();
  }

  searchByKeyword(keyword: string, toSearch: string) {
    if (!keyword) {
      return false;
    }

    return toSearch
      .toString()
      .trim()
      .toLowerCase()
      .includes(keyword.toString().trim().toLowerCase());
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  replacePlaceholders(template: string, data: Record<string, any>, opts?: any) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      let newStr = key in data ? data[key] : match;

      if (opts?.toCapitalize) {
        newStr = this.toTitleCase(newStr);
      }

      return newStr;
    });
  }

  toTitleCase(str: string) {
    if (!str) {
      return ''; // Handle empty or null strings
    }
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
