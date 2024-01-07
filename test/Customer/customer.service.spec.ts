import { Test, TestingModule } from "@nestjs/testing";
import { CustomerService } from "../../src/Services/Customer/customer.service";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Customer } from "../../src/Models/Customer/customer.schema";

describe("CustomerService", () => {
    let customerService: CustomerService;
    let customerModel: Model<Customer>;

    const mockCustomerModel = {
        findOne: jest.fn(),
        exec: jest.fn()
    };

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [CustomerService, {
                provide: getModelToken(Customer.name),
                useValue: mockCustomerModel
            }]
        }).compile();

        customerService = testingModule.get<CustomerService>(CustomerService);
        customerModel = testingModule.get<Model<Customer>>(getModelToken(Customer.name));
    });

    describe("getCustomerData", () => {
        it("get customer data", async () => {
            const mockCustomerData = {
                _id: new Types.ObjectId(),
                customerEmail: "unknown",
                customerPassword: "",
                customerFirstName: "",
                customerLastName: ""
            } as any;

            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomerData)
            } as any);

            const customer: Customer = await customerService.getCustomerData(mockCustomerData._id);

            expect(customer).toEqual(mockCustomerData as Customer);
        });
    });
});