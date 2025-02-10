import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EntityRepositoryType } from '@mikro-orm/core';
import { JoinColumn, RelationId } from 'typeorm';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isMySQL, isPostgres } from '@gauzy/config';
import { ActionTypeEnum, ActorTypeEnum, IActivityLog, ID, IUser, JsonData } from '@gauzy/contracts';
import { BasePerEntityType, User } from '../core/entities/internal';
import { ColumnIndex, MultiORMColumn, MultiORMEntity, MultiORMManyToOne } from '../core/decorators/entity';
import { ActorTypeTransformer } from '../shared/pipes';
import { MikroOrmActivityLogRepository } from './repository/mikro-orm-activity-log.repository';

@MultiORMEntity('activity_log', { mikroOrmRepository: () => MikroOrmActivityLogRepository })
export class ActivityLog extends BasePerEntityType implements IActivityLog {
	[EntityRepositoryType]?: MikroOrmActivityLogRepository;

	@ApiProperty({ enum: ActionTypeEnum })
	@IsNotEmpty()
	@IsEnum(ActionTypeEnum)
	@ColumnIndex()
	@MultiORMColumn()
	action: ActionTypeEnum;

	@ApiPropertyOptional({ enum: ActorTypeEnum })
	@IsOptional()
	@IsEnum(ActorTypeEnum)
	@ColumnIndex()
	@MultiORMColumn({ type: 'int', nullable: true, transformer: new ActorTypeTransformer() })
	actorType?: ActorTypeEnum; // Will be stored as 0 or 1 in DB

	@ApiPropertyOptional({ type: () => String })
	@IsOptional()
	@IsString()
	@MultiORMColumn({ type: 'text', nullable: true })
	description?: string;

	@ApiPropertyOptional({ type: () => Array })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	updatedFields?: string[];

	@ApiPropertyOptional({ type: () => Array })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	previousValues?: Record<string, any>[];

	@ApiPropertyOptional({ type: () => Array })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	updatedValues?: Record<string, any>[];

	@ApiPropertyOptional({ type: () => Array })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	previousEntities?: Record<string, any>[];

	@ApiPropertyOptional({ type: () => Array })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	updatedEntities?: Record<string, any>[];

	@ApiPropertyOptional({ type: () => Object })
	@IsOptional()
	@IsArray()
	@MultiORMColumn({ type: isPostgres() ? 'jsonb' : isMySQL() ? 'json' : 'text', nullable: true })
	data?: JsonData;

	/*
	|--------------------------------------------------------------------------
	| @ManyToOne
	|--------------------------------------------------------------------------
	*/

	/**
	 * User performed action
	 */
	@MultiORMManyToOne(() => User, {
		/** Indicates if relation column value can be nullable or not. */
		nullable: true,

		/** Database cascade action on delete. */
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	creator?: IUser;

	@RelationId((it: ActivityLog) => it.creator)
	@ColumnIndex()
	@MultiORMColumn({ nullable: true, relationId: true })
	creatorId?: ID;
}
