import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  setItem(key: string, value: string): void{
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }

  removeItem(key: string): void{
    if(isPlatformBrowser(this.platformId)){
      localStorage.clear();
      localStorage.removeItem(key);
    }
  }
}
