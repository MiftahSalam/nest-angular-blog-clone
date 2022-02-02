import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogModel } from '../../models/Blog.model';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../models/Response.model';

const BLOG_URL = environment.baseApiUrl + '/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private httpClient: HttpClient) {}

  getAllBlogs(): Observable<BlogModel[]> {
    return this.httpClient.get<ResponseModel>(`${BLOG_URL}/allblogs`).pipe(
      switchMap((result) => {
        const data = result.data as BlogModel[];
        return of(data);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => 'Something bad happened');
      })
    );
  }
}
