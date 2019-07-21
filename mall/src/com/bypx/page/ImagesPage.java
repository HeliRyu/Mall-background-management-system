package com.bypx.page;

public class ImagesPage {
    private String id;
    private String imageName;
    private String imageLink;
    private String addTime;
    private Integer page;
    private Integer size;
    private Integer start_index;
    private Integer end_index;

    public Integer getStart_index() {
        return start_index;
    }

    public void setStart_index(Integer start_index) {
        this.start_index = start_index;
    }

    public Integer getEnd_index() {
        return end_index;
    }

    public void setEnd_index(Integer end_index) {
        this.end_index = end_index;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageLink() {
        return imageLink;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public String getAddTime() {
        return addTime;
    }

    @Override
    public String toString() {
        return "ImagesPage{" +
                "id='" + id + '\'' +
                ", imageName='" + imageName + '\'' +
                ", imageLink='" + imageLink + '\'' +
                ", addTime='" + addTime + '\'' +
                ", page=" + page +
                ", size=" + size +
                ", start_index=" + start_index +
                ", end_index=" + end_index +
                '}';
    }

    public void setAddTime(String addTime) {
        this.addTime = addTime;
    }

}
