import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationService } from "../../src/Services/Authentication/authentication.service";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Customer } from "../../src/Models/Customer/customer.schema";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationDTO } from "../../src/Models/Customer/authentication.dto";
import * as bcrypt from "bcrypt";
import { HASHING_SALT } from "../../src/Config/constant";
import { CustomerResponse } from "../../src/Models/Customer/customer-response.model";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("AuthenticationService", () => {
    let authenticationService: AuthenticationService;
    let customerModel: Model<Customer>;
    let jwtService: JwtService;

    const mockCustomerModel = {
        findOne: jest.fn(),
        create: jest.fn(),
        exec: jest.fn()
    };

    const mockJwtService = {
        signAsync: jest.fn()
    };
    
    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [AuthenticationService, {
                provide: getModelToken(Customer.name),
                useValue: mockCustomerModel
            }, {
                provide: JwtService,
                useValue: mockJwtService
            }]
        }).compile();

        authenticationService = testingModule.get<AuthenticationService>(AuthenticationService);
        customerModel = testingModule.get<Model<Customer>>(getModelToken(Customer.name));
        jwtService = testingModule.get<JwtService>(JwtService);
    });

    describe("register", () => {
        it("register and return customer", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            let encryptedPassword = await bcrypt.hash(authenticationDTO.customerPassword, HASHING_SALT);
            
            const mockCustomerData = {
                _id: new Types.ObjectId(),
                customerEmail: authenticationDTO.customerEmail,
                customerPassword: encryptedPassword,
                customerFirstName: "",
                customerLastName: ""
            } as any;
            
            const token = await jwtService.signAsync({customerId: mockCustomerData._id});
            
            let mockCustomerResponse: CustomerResponse = {
                customerEmail: mockCustomerData.customerEmail,
                customerFirstName: mockCustomerData.customerFirstName,
                customerLastName: mockCustomerData.customerLastName,
                token: token
            } as CustomerResponse;
            
            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            } as any);

            jest.spyOn(customerModel, "create").mockImplementationOnce(() => {
                return Promise.resolve(mockCustomerData);
            });

            jest.spyOn(jwtService, "signAsync").mockImplementationOnce(() => {
                return Promise.resolve(token);
            });

            const customerResponse: CustomerResponse = await authenticationService.register(authenticationDTO);

            expect(customerResponse).toEqual(mockCustomerResponse);
        });

        it("get bad request exception for registered email input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            let encryptedPassword = await bcrypt.hash(authenticationDTO.customerPassword, HASHING_SALT);

            const mockCustomerData = {
                _id: new Types.ObjectId(),
                customerEmail: authenticationDTO.customerEmail,
                customerPassword: encryptedPassword,
                customerFirstName: "",
                customerLastName: ""
            } as any;

            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomerData)
            } as any);

            await expect(authenticationService.register(authenticationDTO)).rejects.toThrow(BadRequestException);
        });
    });

    describe("login", () => {
        it("login and return customer data", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            let encryptedPassword = await bcrypt.hash(authenticationDTO.customerPassword, HASHING_SALT);
            
            const mockCustomerData = {
                _id: new Types.ObjectId(),
                customerEmail: authenticationDTO.customerEmail,
                customerPassword: encryptedPassword,
                customerFirstName: "",
                customerLastName: ""
            } as any;

            let token = await jwtService.signAsync({customerId: mockCustomerData._id});

            const mockCustomerResponse: CustomerResponse = {
                customerEmail: mockCustomerData.customerEmail,
                customerFirstName: mockCustomerData.customerFirstName,
                customerLastName: mockCustomerData.customerLastName,
                token: token
            } as CustomerResponse;

            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomerData)
            } as any);

            jest.spyOn(jwtService, "signAsync").mockImplementationOnce(() => {
                return Promise.resolve(token);
            });
            
            const customerResponse: CustomerResponse = await authenticationService.login(authenticationDTO);

            expect(customerResponse).toEqual(mockCustomerResponse);
        });

        it("get not found exception for wrong email input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            } as any);

            await expect(authenticationService.login(authenticationDTO)).rejects.toThrow(NotFoundException);
        });

        it("get bad request exception for wrong password input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            };

            let encryptedPassword = await bcrypt.hash(authenticationDTO.customerPassword, HASHING_SALT);

            const mockCustomerData = {
                _id: new Types.ObjectId(),
                customerEmail: authenticationDTO.customerEmail,
                customerPassword: encryptedPassword,
                customerFirstName: "",
                customerLastName: ""
            } as any;
            
            jest.spyOn(customerModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomerData)
            } as any);

            authenticationDTO.customerPassword = "place";

            await expect(authenticationService.login(authenticationDTO)).rejects.toThrow(BadRequestException);
        });
    });
});