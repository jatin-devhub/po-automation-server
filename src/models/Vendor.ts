import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, HasMany, HasOne, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import VendorBank from "./VendorBank";
import VendorOther from "./VendorOther";
import SKU from "./SKU";
import BuyingOrder from "./BuyingOrder";
import ContactPerson from "./ContactPerson";
import VendorAddress from "./VendorAddress";
import File from "./File";

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
    @Column({
        type: DataType.STRING
    })
    companyName!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    gst!: string;

    @AllowNull(false)
    @HasOne(() => File)
    gstAtt!: File;

    @Column({
        type: DataType.STRING
    })
    coi!: string;

    @HasOne(() => File)
    coiAtt!: File;

    @Column({
        type: DataType.STRING
    })
    msme!: string;

    @HasOne(() => File)
    msmeAtt!: File;

    @Column({
        type: DataType.STRING
    })
    tradeMark!: string;

    @HasOne(() => File)
    tradeMarkAtt!: File;

    @AllowNull(false)
    @HasOne(() => File)
    agreementAtt!: File;
    
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

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

    @HasMany(() => SKU)
    skus!: SKU[];

    @HasMany(() => BuyingOrder)
    buyingOrders!: BuyingOrder[]

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}