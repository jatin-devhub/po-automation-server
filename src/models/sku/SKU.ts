import {
    Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo, HasMany, Default, Unique,
    HasOne
} from 'sequelize-typescript';
import Vendor from '../vendor/Vendor';
import SKUDetails from './SKUDetails';
import Inventory from './Inventory';

@Table({
    tableName: 'sku',
    timestamps: false
})
export default class SKU extends Model {
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
    skuCode!: string;

    @Column({ type: DataType.STRING })
    name!: string;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    isCombo!: boolean;

    @Column({ type: DataType.STRING })
    ean!: string;

    @HasOne(() => SKUDetails)
    details!: SKUDetails;

    @HasMany(() => Inventory)
    inventory!: Inventory[];

    @ForeignKey(() => Vendor)
    @Column({ type: DataType.INTEGER })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}
