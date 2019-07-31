package fi.academy;

import java.util.Date;

public class Todo {
    private int id;
    private String todo;
    private String tarkempiTodo;
    private boolean valmis;
    private Date aikataulu;

    public Todo() {
        this.valmis = false;
        this.aikataulu = new Date();
    }

    public Todo(String tehtava) {
        this.todo = tehtava;
        this.valmis = false;
        this.aikataulu = new Date();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTodo() {
        return todo;
    }

    public void setTodo(String todo) {
        this.todo = todo;
    }

    public String getTarkempiTodo() {
        return tarkempiTodo;
    }

    public void setTarkempiTodo(String tarkempiTodo) {
        this.tarkempiTodo = tarkempiTodo;
    }

    public boolean isValmis() {
        return valmis;
    }

    public void setValmis(boolean valmis) {
        this.valmis = valmis;
    }

    public Date getAikataulu() {
        return aikataulu;
    }

    public void setAikataulu(Date aikataulu) {
        this.aikataulu = aikataulu;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Todo{");
        sb.append("id=").append(id);
        sb.append(", todo='").append(todo).append('\'');
        sb.append(", tarkempiTodo='").append(tarkempiTodo).append('\'');
        sb.append(", valmis='").append(valmis).append('\'');
        sb.append(", aikataulu='").append(aikataulu).append('\'');
        sb.append('}');
        return sb.toString();
    }
}