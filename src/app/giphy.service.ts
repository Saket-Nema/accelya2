import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GiphyResult, GifData, SearchReqeust } from './gif.interface';

import { Subject, Observable } from 'rxjs';
import { filter, distinct, tap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  static readonly giphyUrl = 'https://api.giphy.com/v1/gifs/';
  static readonly giphyApiKey = 'fplmvx8SXBNfVr2lvEKkibWPwyky5KXG';


  private readonly rating = 'G';
  private readonly lang = 'en';

  currentOffset = 0;
  currentSearchTerm = '';
  currentEndPoint = '';
  pageSize = 20;

  imageResult = [];

  searchResultsSubject = new Subject<Array<GifData>>();
  searchResults$ = new Observable<Array<GifData>>();

  searchRequest = new Subject<SearchReqeust>();
  resetSearch = new Subject<any>();

  constructor(private http: HttpClient) {
    this.searchResults$ = this.searchResultsSubject.asObservable();

    this.searchRequest
      .pipe(distinct((request) => request.offset, this.resetSearch))
      .subscribe((request) => {
        this.getSearchResults(
          request.endPoint,
          request.searchTerm,
          request.offset,
          request.pageSize
        );
      });
  }

  private getSearchResults(
    endPoint: string,
    searchTerm: string,
    offset: number,
    pageSize: number
  ) {
    const params = {
      api_key: GiphyService.giphyApiKey,
      q: searchTerm,
      limit: pageSize.toString(),
      offset: offset.toString(),
      rating: this.rating,
      lang: this.lang,
    };

    this.http
      .get<GiphyResult>(GiphyService.giphyUrl + endPoint, { params })
      .subscribe((giphyResult) => {
        this.imageResult = this.imageResult.concat(giphyResult.data);
        this.currentOffset =
          giphyResult.pagination.offset + giphyResult.pagination.count;

        this.searchResultsSubject.next(this.imageResult);
      });
  }

  search(endPoint: string, searchTerm: string) {
    this.currentSearchTerm = searchTerm;
    this.currentEndPoint = endPoint;
    this.currentOffset = 0;

    this.imageResult = [];
    this.searchResultsSubject.next(this.imageResult);

    this.resetSearch.next(null);

    this.searchRequest.next({
      endPoint: this.currentEndPoint,
      searchTerm: this.currentSearchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  next() {
    this.searchRequest.next({
      endPoint: this.currentEndPoint,
      searchTerm: this.currentSearchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }
}
