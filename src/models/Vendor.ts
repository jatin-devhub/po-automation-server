import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, HasMany, HasOne, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import VendorBank from "./VendorBank";
import VendorOther from "./VendorOther";
import SKU from "./SKU";
import BuyingOrder from "./BuyingOrder";

@Table({
    timestamps: true,
    tableName: 'vendor'
})
export class Vendor extends Model {
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

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    coi!: string;

    @Column({
        type: DataType.STRING
    })
    coiAtt!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    msme!: string;

    @Column({
        type: DataType.STRING,
    })
    msmeAtt!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    tradeMark!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    tradeMarkAtt!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    agreement!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    agreementAtt!: string;

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