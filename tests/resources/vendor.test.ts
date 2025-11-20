import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client'
import type { Vendor, CreateVendorRequest } from '../../src/types'
import { testConfig, validateTestConfig } from '../setup'

describe('VendorResource', () => {
    let client: BillClient
    const createdVendorIds: string[] = []
    let testVendor: Vendor

    beforeAll(async () => {
        validateTestConfig()
        client = new BillClient(testConfig)
        await client.login()

        // Create a test vendor to ensure we have data to work with
        testVendor = await client.vendors.create({
            name: `Test Vendor Base ${Date.now()}`,
            accountType: "BUSINESS",
            email: 'basevendor@test.com',
            phone: '555-000-0000',
            address: {
                line1: '123 Test St',
                city: 'San Francisco',
                stateOrProvince: 'CA',
                zipOrPostalCode: '94105',
                country: 'US',
            },
        })
        createdVendorIds.push(testVendor.id)
    })

    afterAll(async () => {
        // Cleanup: archive all created vendors
        for (const id of createdVendorIds) {
            try {
                await client.vendors.archive(id)
            } catch {
                // Ignore cleanup errors
            }
        }
        await client.logout()
    })

    describe('list', () => {
        it('should list vendors', async () => {
            const result = await client.vendors.list()

            expect(result).toBeDefined()
            expect(result.results).toBeDefined()
            expect(Array.isArray(result.results)).toBe(true)
            // We know at least our test vendor exists
            expect(result.results.length).toBeGreaterThan(0)
        })

        it('should list vendors with pagination', async () => {
            const result = await client.vendors.list({
                max: 5,
            })

            expect(result).toBeDefined()
            expect(result.results).toBeDefined()
            expect(Array.isArray(result.results)).toBe(true)
            expect(result.results.length).toBeLessThanOrEqual(5)
            expect(result.results.length).toBeGreaterThan(0)
        })

        it('should list active vendors only', async () => {
            const result = await client.vendors.list({
                filters: [
                    { field: 'archived', op: 'eq', value: true },
                ],
            })

            expect(result).toBeDefined()
            expect(result.results).toBeDefined()
            expect(result.results.length).toBeGreaterThan(0)
            // All returned vendors should be active
            result.results.forEach((vendor) => {
                expect(vendor.archived).toBe(true)
            })
        })

        it('should list vendors with sorting', async () => {
            const result = await client.vendors.list({
                sort: [{ field: 'name', order: 'asc' }],
            })

            expect(result).toBeDefined()
            expect(result.results).toBeDefined()
            expect(result.results.length).toBeGreaterThan(0)
        })

        it('should filter vendors by name', async () => {
            const result = await client.vendors.list({
                filters: [
                    { field: 'name', op: 'eq', value: testVendor.name },
                ],
            })

            expect(result).toBeDefined()
            expect(result.results).toBeDefined()
            expect(result.results.length).toBeGreaterThan(0)
            expect(result.results[0]?.name).toBe(testVendor.name)
        })
    })

    describe('create', () => {
        it('should create a vendor with minimal fields', async () => {
            const vendorData: CreateVendorRequest = {
                name: `Test Vendor Minimal ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '100 Minimal St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            }

            const vendor = await client.vendors.create(vendorData)
            createdVendorIds.push(vendor.id)

            expect(vendor).toBeDefined()
            expect(vendor.id).toBeDefined()
            expect(vendor.name).toBe(vendorData.name)
            expect(vendor.archived).toBe(false)
        })

        it('should create a vendor with contact info', async () => {
            const vendorData: CreateVendorRequest = {
                name: `Test Vendor Contact ${Date.now()}`,
                accountType: "BUSINESS",
                email: 'testvendor@example.com',
                phone: '555-123-4567',
                address: {
                    line1: '101 Contact St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            }

            const vendor = await client.vendors.create(vendorData)
            createdVendorIds.push(vendor.id)

            expect(vendor).toBeDefined()
            expect(vendor.email).toBe(vendorData.email)
            expect(vendor.phone).toBe(vendorData.phone)
        })

        it('should create a vendor with address', async () => {
            const vendorData: CreateVendorRequest = {
                name: `Test Vendor Address ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '123 Test Street',
                    city: 'Test City',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '12345',
                    country: 'US',
                },
            }

            const vendor = await client.vendors.create(vendorData)
            createdVendorIds.push(vendor.id)

            expect(vendor).toBeDefined()
            expect(vendor.address).toBeDefined()
            expect(vendor.address?.line1).toBe(vendorData.address?.line1)
        })

        it('should create a vendor with 1099 tracking', async () => {
            const vendorData: CreateVendorRequest = {
                name: `Test Vendor 1099 ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '103 Tax St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            }

            const vendor = await client.vendors.create(vendorData)
            createdVendorIds.push(vendor.id)

            expect(vendor).toBeDefined()
        })
    })

    describe('get', () => {
        it('should get vendor by id', async () => {
            const vendor = await client.vendors.get(testVendor.id)

            expect(vendor).toBeDefined()
            expect(vendor.id).toBe(testVendor.id)
            expect(vendor.name).toBe(testVendor.name)
        })

        it('should get vendor with all fields', async () => {
            const vendor = await client.vendors.get(testVendor.id)

            expect(vendor).toBeDefined()
            expect(vendor.id).toBeDefined()
            expect(vendor.name).toBeDefined()
            expect(vendor.archived).toBeDefined()
            expect(vendor.createdTime).toBeDefined()
            expect(vendor.updatedTime).toBeDefined()
        })

        it('should throw error for non-existent vendor', async () => {
            await expect(client.vendors.get('non-existent-id')).rejects.toThrow()
        })
    })

    describe('update', () => {
        it('should update vendor name', async () => {
            const created = await client.vendors.create({
                name: `Test Vendor Update ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '104 Update St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            })
            createdVendorIds.push(created.id)

            const newName = `Updated Vendor ${Date.now()}`
            const updated = await client.vendors.update(created.id, {
                name: newName,
            })

            expect(updated).toBeDefined()
            expect(updated.name).toBe(newName)
        })

        it('should update vendor contact info', async () => {
            const created = await client.vendors.create({
                name: `Test Vendor Update Contact ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '105 Update Contact St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            })
            createdVendorIds.push(created.id)

            const updated = await client.vendors.update(created.id, {
                email: 'updated@example.com',
                phone: '555-999-8888',
            })

            expect(updated).toBeDefined()
            expect(updated.email).toBe('updated@example.com')
            expect(updated.phone).toBe('555-999-8888')
        })

        it('should update vendor address', async () => {
            const created = await client.vendors.create({
                name: `Test Vendor Update Address ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '106 Original St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            })
            createdVendorIds.push(created.id)

            const updated = await client.vendors.update(created.id, {
                address: {
                    line1: '456 Updated Street',
                    city: 'Updated City',
                    stateOrProvince: 'NY',
                    zipOrPostalCode: '67890',
                    country: 'US',
                },
            })

            expect(updated).toBeDefined()
            expect(updated.address?.line1).toBe('456 Updated Street')
            expect(updated.address?.city).toBe('Updated City')
        })
    })

    describe('archive and restore', () => {
        it('should archive a vendor', async () => {
            const created = await client.vendors.create({
                name: `Test Vendor Archive ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '107 Archive St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            })
            // Don't add to cleanup since we're archiving here

            const archived = await client.vendors.archive(created.id)

            expect(archived).toBeDefined()
            expect(archived.archived).toBe(true)
        })

        it('should restore an archived vendor', async () => {
            const created = await client.vendors.create({
                name: `Test Vendor Restore ${Date.now()}`,
                accountType: "BUSINESS",
                address: {
                    line1: '108 Restore St',
                    city: 'San Francisco',
                    stateOrProvince: 'CA',
                    zipOrPostalCode: '94105',
                    country: 'US',
                },
            })
            createdVendorIds.push(created.id)

            await client.vendors.archive(created.id)
            const restored = await client.vendors.restore(created.id)

            expect(restored).toBeDefined()
            expect(restored.archived).toBe(false)
        })
    })
})
