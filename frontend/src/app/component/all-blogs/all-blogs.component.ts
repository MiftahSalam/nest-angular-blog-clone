import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { BlogModel } from '../../models/Blog.model';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.css'],
})
export class AllBlogsComponent implements OnInit {
  allBlogs: BlogModel[] = [];
  blogApiUrl;
  private refresh$ = new BehaviorSubject<any>('');

  constructor(private readonly blogService: BlogService) {
    this.blogApiUrl = 'api/blog';
  }

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe((blogs) => {
      blogs.forEach((blog) => {
        console.log(blog);
        this.allBlogs.push(blog);
      });
    });
  }
}
