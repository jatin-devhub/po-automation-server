import {
    Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo, Default, HasOne
} from 'sequelize-typescript';
import SKU from './SKU';
import SKUDimensions from './SKUDimensions';

@Table({
    tableName: 'sku_details'
})
export default class SKUDetails extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({ type: DataType.STRING })
    category!: string;

    @Column({ type: DataType.STRING })
    subCategory!: string;

    @Column({ type: DataType.STRING })
    sapCode!: string;

    @Column({ type: DataType.STRING })
    hsn!: string;

    @Column({ type: DataType.STRING })
    modelNumber!: string;

    @Column({ type: DataType.FLOAT })
    mrp!: number;

    @Column({ type: DataType.FLOAT })
    gst!: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    createdBy!: string

    @HasOne(() => SKUDimensions)
    dimensions!: SKUDimensions;

    @ForeignKey(() => SKU)
    @Column({ type: DataType.INTEGER })
    skuId!: number;

    @BelongsTo(() => SKU)
    sku?: SKU;
}
