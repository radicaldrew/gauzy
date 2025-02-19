import { IBasePerTenantAndOrganizationEntityModel, JsonData, OmitFields } from './base-entity.model';
import { IDashboardWidget } from './dashboard-widget.model';
import { IEmployeeEntityInput } from './employee.model';
import { ExcludeUserCreatorFields, IHasUserCreator } from './user.model';

/**
 * Interface representing a Dashboard entity.
 */
export interface IDashboard extends IBasePerTenantAndOrganizationEntityModel, IEmployeeEntityInput, IHasUserCreator {
	name: string;
	identifier: string;
	description?: string;
	contentHtml?: JsonData;
	isDefault?: boolean;
	widgets?: IDashboardWidget[];
}

/**
 * Input interface for creating a Dashboard entity.
 */
export interface IDashboardCreateInput
	extends OmitFields<IDashboard, 'isDefault'>,
		ExcludeUserCreatorFields<IDashboard> {}

/**
 * Input interface for updating a Dashboard entity.
 */
export interface IDashboardUpdateInput extends Partial<IDashboardCreateInput> {}
