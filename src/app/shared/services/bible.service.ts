import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BibleService {

  private KEY = '2018a519def746c1e44a8117c1108eaa';
  protected url = 'https://api.scripture.api.bible';
  protected OPTIONS = {
    params: {},
    withCredentials: false,
    headers: {
      'api-key': this.KEY
    },
  };

  constructor(protected http: HttpClient) { }

  /**
   * Gets an array of Bible objects authorized for current API Key.
   *
   * @param lang Filter based on language.
   * @param abbr Filter based on abbreviated name.
   * @param name Filter based on name of translation.
   * @param ids Filter based on comma separated list of bible ids.
   */
  fetchBibles(lang?: string, abbr?: string, name?: string, ids?: string) {
    const url = `${this.url}/v1/bibles`;
     // add params if not null
    if (lang) {
      this.OPTIONS.params['language'] = lang;
    }
    if (abbr) {
      this.OPTIONS.params['abbreviation'] = abbr;
    }
    if (name) {
      this.OPTIONS.params['name'] = name;
    }
    if (ids) {
      this.OPTIONS.params['ids'] = ids;
    }
    return this.http.get<any>(url, this.OPTIONS);
  }

  /**
   * Executes a search against the Bible with the given id.
   * @param id The id of the Bible.
   * @param query A given user provided query.
   * @param limit Number of results to fetch.
   * @param offset Offset of results.
   */
  search(id: string, query: string, limit: number = 10, offset: number = 0) {
    const url = `${this.url}/v1/bibles/${id}/search`;
    this.OPTIONS.params['query'] = query;
    this.OPTIONS.params['limit'] = limit;
    this.OPTIONS.params['offset'] = offset;
    return this.http.get<any>(url, this.OPTIONS);
  }
}
