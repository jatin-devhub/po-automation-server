import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, HasMany, HasOne, IsEmail, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import VendorBank from "./VendorBank";
import VendorOther from "./VendorOther";
import SKU from "./SKU";
import BuyingOrder from "./BuyingOrder";
import ContactPerson from "./ContactPerson";
import VendorAddress from "./VendorAddress";
import File from "./File";
import Comment from "./Comment";

@Table({
    timestamps: true,
    tableName: 'vendor'
})
export default class Vendor extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    vendorCode!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    productCategory!: string

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    companyName!: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    gst!: string;

    @HasOne(() => File, { foreignKey: 'gstAttVendorId' })
    gstAtt!: File;

    @Column({
        type: DataType.STRING
    })
    coi!: string;

    @HasOne(() => File, { foreignKey: 'coiAttVendorId' })
    coiAtt!: File;

    @Column({
        type: DataType.STRING
    })
    msme!: string;

    @HasOne(() => File, { foreignKey: 'msmeAttVendorId' })
    msmeAtt!: File;

    @Column({
        type: DataType.STRING
    })
    tradeMark!: string;

    @HasOne(() => File, { foreignKey: 'tradeMarkAttVendorId' })
    tradeMarkAtt!: File;

    @HasOne(() => File, { foreignKey: 'agreementAttVendorId' })
    agreementAtt!: File;
    
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

    @IsEmail
    @Column({
        type: DataType.STRING
    })
    createdBy!: string

    @HasOne(() => ContactPerson)
    contactPerson!: ContactPerson;

    @HasOne(() => VendorAddress)
    address!: VendorAddress;

    @HasOne(() => VendorBank)
    vendorBank?: VendorBank;

    @HasMany(() => VendorOther)
    otherFields!: VendorOther[];

    @HasMany(() => Comment)
    comments!: Comment[]

    @HasMany(() => SKU)
    skus!: SKU[];

    @HasMany(() => BuyingOrder)
    buyingOrders!: BuyingOrder[]

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}