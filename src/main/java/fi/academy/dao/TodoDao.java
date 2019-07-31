package fi.academy.dao;

import fi.academy.Todo;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class TodoDao {
    private List<Todo> tehtavat;
    private Connection con;
    private String table = "todo";


    public TodoDao() throws SQLException, ClassNotFoundException {
        Class.forName("org.postgresql.Driver");
        con = DriverManager.getConnection("jdbc:postgresql://localhost:5432/tietokanta", "postgres", "Sovelto1");
        tehtavat = new ArrayList<>();
    }

    public List haeKaikki() {
        String sql = "SELECT * FROM " + table + " ORDER BY id";
        tehtavat.clear();
        List<Todo> haetut = new ArrayList<>();
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            for (ResultSet rs = pstmt.executeQuery(); rs.next() ;) {
                Todo t = new Todo();
                t.setId(rs.getInt("id"));
                t.setTodo(rs.getString("todo"));
                t.setTarkempiTodo(rs.getString("tarkempitodo"));
                t.setValmis(rs.getBoolean("valmis"));
                t.setAikataulu(rs.getTimestamp("aikataulu"));

                haetut.add(t);
                tehtavat.add(t);

            }
        } catch (SQLException e) {
            e.printStackTrace();
            return Collections.EMPTY_LIST;
        }
        return haetut;
    }

    public int lisaa(Todo tehtava) {
        String sql = "INSERT INTO " + table + " (todo, tarkempitodo, valmis, aikataulu) VALUES (?,?,?,?)";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, tehtava.getTodo());
            pstmt.setString(2, tehtava.getTarkempiTodo());
            pstmt.setBoolean(3, tehtava.isValmis());
            pstmt.setTimestamp(4, new Timestamp(tehtava.getAikataulu().getTime()));
            pstmt.execute();
            tehtavat.add(tehtava);
            return tehtava.getId();
        } catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }
    }

    public Todo poista(int id) {
        String sql = "DELETE FROM " + table + " WHERE id= " + id + ";";
        Todo t = null;
        try (PreparedStatement pstmt = con.prepareStatement(sql)){
            for (Todo haku : tehtavat) {
                if (haku.getId()==id) t = haku;
            }
            pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return t;
    }

    public boolean muuta(int id, Todo tehtava) {

        for(Todo t : tehtavat) {
            if(t.getId()==id) {
                if(tehtava.getTodo() != null) t.setTodo(tehtava.getTodo());
                if(tehtava.getTarkempiTodo() != null) t.setTarkempiTodo(tehtava.getTarkempiTodo());
                t.setValmis(tehtava.isValmis());
                t.setAikataulu(tehtava.getAikataulu());
                String sql = "UPDATE " + table + " SET valmis = " + t.isValmis() + ", todo = '" + t.getTodo() + "', tarkempitodo = '" + t.getTarkempiTodo() + "', aikataulu = '" + t.getAikataulu() + "' WHERE id = " + id + ";";
                try (PreparedStatement pstmt = con.prepareStatement(sql)) {
                    pstmt.executeUpdate();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return true;
            }
        }
        return false;
    }

}