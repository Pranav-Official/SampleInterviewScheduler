/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateCreate } from '../models/CandidateCreate';
import type { CandidateUpdate } from '../models/CandidateUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CandidatesService {
    /**
     * Create Candidate
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createCandidateCandidatesPost(
        requestBody: CandidateCreate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/candidates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Candidates
     * @param limit
     * @param offset
     * @param name Filter by name (partial match)
     * @param skills Filter by skills (multi-select)
     * @param experience Filter by experience (<= value)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCandidatesCandidatesGet(
        limit: number = 10,
        offset?: number,
        name?: (string | null),
        skills?: (Array<string> | null),
        experience?: (number | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/candidates/',
            query: {
                'limit': limit,
                'offset': offset,
                'name': name,
                'skills': skills,
                'experience': experience,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Candidate
     * @param candidateId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateCandidateCandidatesCandidateIdPut(
        candidateId: string,
        requestBody: CandidateUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/candidates/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Candidate
     * @param candidateId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCandidateCandidatesCandidateIdGet(
        candidateId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/candidates/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
