import { BaseResource } from './base'
import {
  type Vendor,
  type CreateVendorRequest,
  type UpdateVendorRequest,
  type VendorListParams,
} from '../types'

export class VendorResource extends BaseResource<
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorListParams
> {
  protected readonly endpoint = '/v3/vendors'
  protected readonly bulkResponseKey = 'vendors'
}
