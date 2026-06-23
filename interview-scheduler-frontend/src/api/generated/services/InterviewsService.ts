/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterviewCreate } from '../models/InterviewCreate';
import type { InterviewStatus } from '../models/InterviewStatus';
import type { InterviewStatusUpdate } from '../models/InterviewStatusUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InterviewsService {
    /**
     * Create Interview
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createInterviewInterviewsPost(
        requestBody: InterviewCreate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/interviews/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Interviews
     * @param limit
     * @param offset
     * @param candidateId Filter by candidate ID
     * @param status Filter by status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInterviewsInterviewsGet(
        limit: number = 10,
        offset?: number,
        candidateId?: (string | null),
        status?: (InterviewStatus | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/interviews/',
            query: {
                'limit': limit,
                'offset': offset,
                'candidate_id': candidateId,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Interview Status
     * @param interviewId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateInterviewStatusInterviewsInterviewIdStatusPatch(
        interviewId: string,
        requestBody: InterviewStatusUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/interviews/{interview_id}/status',
            path: {
                'interview_id': interviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Interview
     * @param interviewId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInterviewInterviewsInterviewIdGet(
        interviewId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/interviews/{interview_id}',
            path: {
                'interview_id': interviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
