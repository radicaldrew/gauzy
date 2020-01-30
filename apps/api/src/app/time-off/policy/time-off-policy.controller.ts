import { Controller, HttpStatus, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController } from '../../core/crud/crud.controller';

import { TimeOffPolicy } from './time-off-policy.entity';

import {
	TimeOffPolicyCreateInput as ITimeOffPolicyCreateInput,
	TimeOffPolicy as ITimeOffPolicy
} from '@gauzy/models';
import { IPagination } from '../../core';
import { TimeOffPolicyService } from './time-off-policy.service';

@ApiTags('Policy')
@Controller()
export class TimeOffPolicyControler extends CrudController<TimeOffPolicy> {
	constructor(private readonly policyService: TimeOffPolicyService) {
		super(policyService);
	}

	@ApiOperation({ summary: 'Find all policies.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found policies',
		type: TimeOffPolicy
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/policy')
	async findAllTimeOffPolicies(
		@Query('data') data: string
	): Promise<IPagination<ITimeOffPolicy>> {
		const { relations, findInput, filterDate } = JSON.parse(data);

		return this.policyService.getAllPolicies({
			where: findInput,
			relations
		});
	}

	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.' /*, type: T*/
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Post('/policy/create')
	async createTimeOffPolicy(
		@Body() entity: ITimeOffPolicyCreateInput,
		...options: any[]
	): Promise<ITimeOffPolicy> {
		return this.policyService.create(entity);
	}
}
