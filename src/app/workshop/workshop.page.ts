import { Component, OnInit } from '@angular/core';
import { CustomloaderService } from '../services/customloader.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.page.html',
  styleUrls: ['./workshop.page.scss'],
})
export class WorkshopPage implements OnInit {
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
    this.postService.getPostDataPage(61, 1).subscribe(async item => {
      this.posts = item;
      this.blocklength = item.length;
      await this.loadingController.hideLoader(loading);
    }, async error => {
      await this.loadingController.hideLoader(loading);
    })
  }

  loadData(event: any) {
    const page = (Math.ceil(this.posts.length / 10)) + 1;
    this.postService.getPostDataPage(61, page).subscribe(
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
