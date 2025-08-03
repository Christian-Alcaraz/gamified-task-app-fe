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

  replacePlaceholders(template: string, data: Record<string, any>) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return key in data ? data[key] : match;
    });
  }
}
