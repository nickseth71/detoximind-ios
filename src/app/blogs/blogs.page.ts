import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { CustomloaderService } from '../services/customloader.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
})
export class BlogsPage implements OnInit {
  posts: any;
  blocklength: any;

  constructor(
    private postService: PostService,
    public loadingController: CustomloaderService
  ) { }

  ngOnInit() {
    this.getPost();
  }

  async getPost() {
    const loading = await this.loadingController.showLoader();
    this.postService.getPostDataPage(62, 1).subscribe(async item => {
      this.posts = item;
      this.blocklength = item.length;
      await this.loadingController.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingController.hideLoader(loading);
    })
  }

  loadData(event: any) {
    const page = (Math.ceil(this.posts.length / 10)) + 1;
    this.postService.getPostDataPage(62, page).subscribe(
      async (newPagePosts) => {
        this.posts.push(...newPagePosts);
        event.target.complete();
      },
      async (err) => {
        event.target.disabled = true;
        console.log(err);
      });

  }

}
