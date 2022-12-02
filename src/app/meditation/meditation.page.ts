import { Component, OnInit } from '@angular/core';
import { CustomloaderService } from '../services/customloader.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-meditation',
  templateUrl: './meditation.page.html',
  styleUrls: ['./meditation.page.scss'],
})
export class MeditationPage implements OnInit {
  posts: any;
  constructor(
    private postService: PostService,
    public loader_cust: CustomloaderService,
  ) { }

  ngOnInit() {
    this.getPost();
  }

  async getPost() {
    const loading = await this.loader_cust.showLoader();
    this.postService.getPostDataPage(41, 1).subscribe(async item => {
      this.posts = item;
      await this.loader_cust.hideLoader(loading);
    }, async error => {
      await this.loader_cust.hideLoader(loading);
    })
  }

  loadData(event: any) {
    const page = (Math.ceil(this.posts.length / 10)) + 1;
    this.postService.getPostDataPage(41, page).subscribe(
      async (newPagePosts) => {
        this.posts.push(...newPagePosts);
        event.target.complete();
      },
      async (err) => {
        event.target.disabled = true;
      });

  }

}
