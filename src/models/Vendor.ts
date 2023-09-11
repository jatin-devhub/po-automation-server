import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, HasMany, HasOne, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import VendorBank from "./VendorBank";
import VendorOther from "./VendorOther";
import SKU from "./SKU";
import BuyingOrder from "./BuyingOrder";
import ContactPerson from "./ContactPerson";
import VendorAddress from "./VendorAddress";

@Table({
    timestamps: true,
    tableName: 'vendor'
})
export default class Vendor extends Model {
    @AllowNull(false)
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
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    gstAtt!: string;

    @Column({
        type: DataType.STRING
    })
    coi!: string;

    @Column({
        type: DataType.STRING
    })
    coiAtt!: string;

    @Column({
        type: DataType.STRING
    })
    msme!: string;

    @Column({
        type: DataType.STRING,
    })
    msmeAtt!: string;

    @Column({
        type: DataType.STRING
    })
    tradeMark!: string;

    @Column({
        type: DataType.STRING
    })
    tradeMarkAtt!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    agreementAtt!: string;
    
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

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