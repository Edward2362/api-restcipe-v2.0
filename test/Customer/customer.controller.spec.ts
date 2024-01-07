import { Test, TestingModule } from "@nestjs/testing";
import { CustomerService } from "../../src/Services/Customer/customer.service";
import { CustomerController } from "../../src/Controllers/Customer/customer.controller";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Customer } from "../../src/Models/Customer/customer.schema";
import { CustomerResponse } from "../../src/Models/Customer/customer-response.model";
import { MessageResponse } from "../../src/Models/MessageResponse/message-response.model";
import { HttpStatus, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

describe("CustomerController", () => {
    let customerService: CustomerService;
    let customerController: CustomerController;

    const mockCustomerModel = {
        findOne: jest.fn(),
        exec: jest.fn()
    };

    const mockJwtService = {
        signAsync: jest.fn()
    };

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [CustomerController],
            providers: [CustomerService, {
                provide: getModelToken(Customer.name),
                useValue: mockCustomerModel
            }, {
                provide: JwtService,
                useValue: mockJwtService
            }]
        }).compile();

        customerService = testingModule.get<CustomerService>(CustomerService);
        customerController = testingModule.get<CustomerController>(CustomerController);
    });

    describe("getData", () => {
        it("get customer data", async () => {
            const token: string = "";

            const mockCustomerData: Customer = {
                _id: new Types.ObjectId(),
                customerEmail: "unknown",
                customerPassword: "",
                customerFirstName: "",
                customerLastName: ""
            } as Customer;

            const mockCustomerResponse: CustomerResponse = {
                customerEmail: mockCustomerData.customerEmail,
                customerFirstName: mockCustomerData.customerFirstName,
                customerLastName: mockCustomerData.customerLastName,
                token: token
            } as CustomerResponse;

            const mockMessageResponse: MessageResponse<CustomerResponse> = {
                statusCode: HttpStatus.OK,
                data: mockCustomerResponse,
                message: ""
            } as MessageResponse<CustomerResponse>;

            jest.spyOn(customerService, "getCustomerData").mockImplementationOnce(() => {
                return Promise.resolve(mockCustomerData);
            });

            const messageResponse: MessageResponse<CustomerResponse> = await customerController.getData(mockCustomerData._id.toString(), token);

            expect(messageResponse).toEqual(mockMessageResponse);
        });

    });
});