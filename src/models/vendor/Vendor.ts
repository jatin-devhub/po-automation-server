import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
// import SKU from "../SKU";
// import BuyingOrder from "../BuyingOrder";

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

    // @HasMany(() => SKU)
    // skus!: SKU[];

    // @HasMany(() => BuyingOrder)
    // buyingOrders!: BuyingOrder[]

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}