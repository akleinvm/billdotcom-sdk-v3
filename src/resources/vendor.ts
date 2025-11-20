import { BaseResource } from './base'
import {
  VendorSchema,
  type Vendor,
  type CreateVendorRequest,
  type UpdateVendorRequest,
  type VendorListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class VendorResource extends BaseResource<
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorListParams
> {
  protected readonly endpoint = '/v3/vendors'
  protected readonly entitySchema = VendorSchema
  protected readonly listSchema = PaginatedResponseSchema(VendorSchema)
}
