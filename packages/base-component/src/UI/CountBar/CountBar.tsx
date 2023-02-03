import { BaseCountBarProps } from '../../Components';
import { Component, createRef } from '../../Framework';
import styles from './index.module.less';

type CountState = {
    zoom: number;
    content: string;
};

export class CountBar extends Component<BaseCountBarProps, CountState> {
    max = 400;

    min = 0;

    ref = createRef();

    initialize(props: BaseCountBarProps) {
        this.state = {
            zoom: 100,
            content: '',
        };
    }

    setValue = (value: object, fn?: () => void) => {
        this.setState(
            (prevState) => ({
                ...value,
            }),
            fn
        );
    };

    setZoom(zoom: number): void {
        if (zoom !== this.state.zoom) {
            this.setValue({
                zoom,
            });
            this.ref.current.changeInputValue(0, zoom);
        }
    }

    onChange = (e: Event) => {
        let target = e.target as HTMLInputElement;
        this.props.changeRatio?.(target.value);
        this.setValue({ zoom: target.value });
        this.ref.current.changeInputValue(0, target.value);
    };

    handleClick = (e: Event, value: number | string) => {
        this.setValue({ zoom: value });
    };

    addZoom = () => {
        let number = Math.floor(this.state.zoom / 10);
        let value = (number + 1) * 10;
        if (value >= this.max) value = this.max;
        this.setValue({ zoom: value });
        this.props.changeRatio?.(String(value));
    };

    reduceZoom = () => {
        let number = Math.ceil(this.state.zoom / 10);
        let value = (number - 1) * 10;
        if (value <= this.min) value = this.min;
        this.setValue({ zoom: value });
        this.props.changeRatio?.(String(value));
        this.ref.current.changeInputValue(0, value);
    };

    componentDidMount() {
        this.props.getComponent?.(this);
    }

    render(props: BaseCountBarProps, state: CountState) {
        const { zoom, content } = state;
        const ReduceIcon = this.getComponentRender().renderFunction('ReduceIcon');
        const RegularIcon = this.getComponentRender().renderFunction('RegularIcon');
        const Slider = this.getComponentRender().renderFunction('Slider');
        const Button = this.getComponentRender().renderFunction('Button');
        const AddIcon = this.getComponentRender().renderFunction('AddIcon');
        // const PageIcon = this.getComponentRender().renderFunction('PageIcon');
        // const LayoutIcon = this.getComponentRender().renderFunction('LayoutIcon');
        return (
            <div className={styles.countBar}>
                <Button type="text" className={styles.countZoom}>
                    {zoom}
                </Button>
                <Button type="text" onClick={this.addZoom}>
                    <AddIcon />
                </Button>
                <div className={styles.countSlider}>
                    <Slider ref={this.ref} onChange={this.onChange} value={zoom} min={this.min} max={this.max} onClick={this.handleClick} />
                </div>
                <Button type="text" onClick={this.reduceZoom}>
                    <ReduceIcon />
                </Button>
                {/* <Button type="text">
                    <PageIcon />
                </Button> */}
                {/* <Button type="text">
                    <LayoutIcon />
                </Button> */}
                <Button type="text">
                    <RegularIcon />
                </Button>
                <span className={styles.countStatistic}>{content}</span>
            </div>
        );
    }
}
